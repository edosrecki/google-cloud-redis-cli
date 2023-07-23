foreground=yes
output=/tmp/stunnel.log
CAfile=/ca/cert.pem
client=yes
verifyChain=yes
sslVersion=TLSv1.2

[redis]
accept=127.0.0.1:$PORT
connect=$HOST:$PORT
