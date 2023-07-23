#!/usr/bin/env bash

version="$1"
url="https://github.com/edosrecki/google-cloud-redis-cli/releases/download/v$version/google-cloud-redis-macos-$version.tar.gz"
checksum=$(shasum -a 256 bin/google-cloud-redis-macos.tar.gz | awk '{ print $1 }')

git clone "https://${HOMEBREW_TOOLS_TOKEN}@github.com/edosrecki/homebrew-tools.git"
cd homebrew-tools

git config user.email "${GIT_EMAIL}"
git config user.name "Dinko Osrecki"

cat <<EOF > google-cloud-redis.rb
class GoogleCloudRedis < Formula
  desc "Connect to private Google Cloud Redis instance through stunnel proxy running in GKE cluster."
  homepage "https://github.com/edosrecki/google-cloud-redis-cli"
  url "$url"
  sha256 "$checksum"
  def install
    bin.install "google-cloud-redis"
  end
  test do
    system "#{bin}/google-cloud-redis", "--version"
  end
end
EOF

git add google-cloud-redis.rb
git commit -m "chore: release google-cloud-redis v$version"
git push

cd ..
rm -rf homebrew-tools
