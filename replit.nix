{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.ffmpeg-full
    pkgs.nodePackages.typescript-language-server
    pkgs.nodePackages.nodemon
  ];
}
