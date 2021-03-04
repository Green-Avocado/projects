#!/usr/bin/bash

mkdir -p logs
nginx -p . -c router.conf

