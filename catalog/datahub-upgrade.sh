#!/bin/bash

# read -p "Desired datahub version, for example 'v0.10.1' (defaults to newest): " VERSION
VERSION=${DATAHUB_VERSION:-v0.14.1}
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
IMAGE=acryldata/datahub-upgrade:$VERSION
CONTAINER_NAME=datahub-upgrade-script

cd $DIR && docker pull ${IMAGE} && docker run --name ${CONTAINER_NAME} --env-file ../.env --network="solarie_datanet" ${IMAGE} "$@"
