# Stage 0: Build plugins using Node.js
FROM docker.io/library/node:22.3 AS builder

WORKDIR /headlamp-plugins
ARG PLUGIN="enbuild-theme"

# Copy only necessary files to build the plugin
COPY ./ /headlamp-plugins/${PLUGIN}
RUN npm install npm@10.8.1 && npm --version
RUN npm install
RUN npm install -g @kinvolk/headlamp-plugin
RUN headlamp-plugin build /headlamp-plugins/${PLUGIN}
RUN mkdir -p /headlamp-plugins/build/${PLUGIN}
RUN headlamp-plugin extract /headlamp-plugins/${PLUGIN} /headlamp-plugins/build/${PLUGIN}

# Stage 1: Final image with Alpine Linux
FROM alpine:3.22.0

# Create a non-root user and group
RUN addgroup -S headlamp && adduser -S headlamp -G headlamp

# Copy built plugin from the previous stage
COPY --from=builder /headlamp-plugins/build/${PLUGIN}/ /plugins/
COPY --from=knrt10/headlamp-plugins-test:latest /plugins/dynamic-clusters /plugins/dynamic-clusters
COPY --from=knrt10/headlamp-plugins-test:latest /plugins/cluster-chooser /plugins/cluster-chooser

RUN chown -R headlamp:headlamp /plugins && \
    chmod -R 755 /plugins

LABEL org.opencontainers.image.source=https://github.com/vivsoftorg/enbuild-headlmap-theme.git \
      org.opencontainers.image.licenses=APACHE-2.0 \
      org.opencontainers.image.description="Headlamp plugin for enbuild theme"  \
      org.opencontainers.image.title="enbuild-headlamp-theme" \
      org.opencontainers.image.vendor="Vivsoft" \
      org.opencontainers.image.version="0.1.0" \
      org.opencontainers.image.revision="HEAD" \
      org.opencontainers.image.url="https://github.com/vivsoftorg/enbuild-headlamp-theme" \
      org.opencontainers.image.authors="Juned Memon <junaid181813@gmail.com>"

USER headlamp

CMD ["sh", "-c", "echo Plugins installed at /plugins/:; ls /plugins/"]
