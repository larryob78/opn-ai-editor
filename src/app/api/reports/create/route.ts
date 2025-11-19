import { NextRequest, NextResponse } from 'next/server';
import { createReport } from '@/lib/db/reports';
import { getActiveOrganisations } from '@/lib/db/organisations';
import { createAuditLog } from '@/lib/db/auditLogs';
import { getWeatherData, calculateRiskLevel } from '@/lib/utils/weather';
import { reverseGeocode, isInDublin } from '@/lib/utils/maps';
import { findNearestOrganisation } from '@/lib/utils/distance';
import type { ContactPreference } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      latitude,
      longitude,
      gpsAccuracyMeters,
      notes,
      hasPhoto,
      photoUrl,
      contactPreference,
      contactName,
      contactPhone,
      contactEmail,
      spotterId,
    } = body;

    // Validate required fields
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // 1. Reverse geocode coordinates
    const geocodedData = await reverseGeocode(latitude, longitude);

    // 2. Fetch weather data
    const weatherData = await getWeatherData(latitude, longitude);

    // 3. Calculate risk level
    const riskLevel = calculateRiskLevel(weatherData);

    // 4. Determine organisation routing
    let organisationId = '';
    const routingMetadata: Record<string, any> = {
      city: geocodedData.city,
      temperature: weatherData.temperatureC,
      riskLevel,
    };

    // Dublin priority logic: temperature <= 5°C
    if (isInDublin(geocodedData.city) && weatherData.temperatureC <= 5) {
      organisationId = 'org_beta_dublin';
      routingMetadata.routingMethod = 'DUBLIN_PRIORITY';
    } else {
      // Use Haversine nearest organisation
      const activeOrgs = await getActiveOrganisations();

      const nearest = findNearestOrganisation(latitude, longitude, activeOrgs);

      if (nearest) {
        organisationId = nearest.id;
        routingMetadata.routingMethod = 'NEAREST_ORGANISATION';
        routingMetadata.distanceKm = nearest.distance;
      } else {
        // Fallback to default
        organisationId = 'org_beta_dublin';
        routingMetadata.routingMethod = 'FALLBACK_DEFAULT';
      }
    }

    // 5. Create report
    const report = await createReport({
      spotterId,
      latitude,
      longitude,
      geocodedAddress: geocodedData.formattedAddress,
      city: geocodedData.city,
      county: geocodedData.county,
      country: geocodedData.country,
      temperatureC: weatherData.temperatureC,
      feelsLikeC: weatherData.feelsLikeC,
      weatherDescription: weatherData.description,
      gpsAccuracyMeters: gpsAccuracyMeters || 0,
      riskLevel,
      notes,
      hasPhoto: hasPhoto || false,
      photoUrl,
      contactPreference: contactPreference || 'ANONYMOUS',
      contactName,
      contactPhone,
      contactEmail,
      organisationId,
    });

    // 6. Create audit log for routing decision
    await createAuditLog({
      type: 'REPORT_ROUTING',
      reportId: report.id,
      metadata: routingMetadata,
    });

    // 7. If RED risk in Dublin, also notify Peter McVerry Trust
    if (riskLevel === 'RED' && isInDublin(geocodedData.city)) {
      await createAuditLog({
        type: 'SECONDARY_NOTIFICATION',
        reportId: report.id,
        metadata: {
          secondaryOrganisation: 'org_pmvtrust',
          reason: 'RED_RISK_DUBLIN',
        },
      });
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report', details: (error as Error).message },
      { status: 500 }
    );
  }
}
