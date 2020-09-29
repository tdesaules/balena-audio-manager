FROM alpine:3.11

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

ENV BALENACLOUD_API_URL=https://api.balena-cloud.com/
ENV BALENACLOUD_API_KEY=kJBE6SPqbrQHKPX9b0nGkPVPlEGX6Cj8
ENV SNAPCAST_DEVICE_NAME=chambre
ENV BALENA_APP_NAME=Audio
ENV BALENA_DEVICE_NAME_AT_INIT=chambre

COPY setup.sh /tmp/setup.sh

RUN apk update
RUN apk add --no-cache wget coreutils ca-certificates
RUN /bin/ash /tmp/setup.sh "$USERNAME" "$USER_UID" "$USER_GID"
RUN apk add --no-cache nodejs npm
RUN rm /tmp/setup.sh