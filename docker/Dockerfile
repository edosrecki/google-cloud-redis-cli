FROM alpine
RUN apk add --no-cache gettext dumb-init stunnel

USER 1000
WORKDIR /stunnel

COPY stunnel.conf.tpl ./
COPY stunnel.sh ./

ENTRYPOINT ["dumb-init"]
CMD ["./stunnel.sh"]
