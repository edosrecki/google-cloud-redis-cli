#!/usr/bin/env bash

version="$1"

npx -y replace-in-file '0.0.0-dev' "$version" ./src/lib/version.ts
npm run bundle

cd bin
tar --transform s/-linux// -czf "google-cloud-redis-linux.tar.gz" google-cloud-redis-linux
tar --transform s/-macos// -czf "google-cloud-redis-macos.tar.gz" google-cloud-redis-macos
tar --transform s/-win// -czf "google-cloud-redis-win.tar.gz" google-cloud-redis-win.exe
cd ..
