FROM alpine
RUN apk add --no-cache gettext dumb-init stunnel

USER stunnel
WORKDIR /stunnel

COPY --chown=stunnel:stunnel stunnel.conf.tpl ./
COPY --chown=stunnel:stunnel stunnel.sh ./

ENTRYPOINT ["dumb-init"]
CMD ["./stunnel.sh"]
