FROM node:8.9.4-alpine
LABEL application="genesis" \
  maintainer="zephinzer <dev-at-joeir-dot-net>"
ENV NODE_ENV=production
WORKDIR /app
COPY . /app
RUN chmod +x .build-scripts/install-dependencies-globally.js \
  && .build-scripts/install-dependencies-globally.js
ENTRYPOINT [ "./scripts/entrypoint.sh" ]