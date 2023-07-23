#!/bin/sh

envsubst < ./stunnel.conf.tpl > ./stunnel.conf

stunnel ./stunnel.conf
