{
  description = "Effect v4 kata gauntlet — dev environment (Node 24 + pnpm via corepack)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        node = pkgs.nodejs_24;
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            node          # Node.js 24 (ships corepack)
            pkgs.git
          ];

          # pnpm is pinned in package.json ("packageManager": "pnpm@11.13.1").
          # corepack (bundled with Node) provisions that exact version on first use.
          shellHook = ''
            export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
            corepack enable >/dev/null 2>&1 || true
            echo "Effect v4 gauntlet dev shell"
            echo "  node $(node --version)  |  pnpm $(corepack pnpm --version 2>/dev/null || echo '(first run downloads pnpm@11.13.1)')"
            echo "  run: corepack pnpm install  then  corepack pnpm gauntlet"
          '';
        };
      });
}
