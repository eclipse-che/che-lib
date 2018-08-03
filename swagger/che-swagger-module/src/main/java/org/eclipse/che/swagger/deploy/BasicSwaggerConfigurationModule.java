/*
 * Copyright (c) 2012-2018 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
package org.eclipse.che.swagger.deploy;

import static java.util.Objects.requireNonNull;

import com.google.common.collect.ImmutableMap;
import com.google.inject.servlet.ServletModule;
import java.io.File;
import java.net.URL;
import java.util.jar.JarFile;
import java.util.jar.Manifest;
import org.slf4j.LoggerFactory;

/**
 * Module provide basic swagger configuration
 *
 * @author Sergii Kabashnyuk
 */
public class BasicSwaggerConfigurationModule extends ServletModule {
  private static final org.slf4j.Logger LOG =
      LoggerFactory.getLogger(BasicSwaggerConfigurationModule.class);

  @Override
  protected void configureServlets() {
    bind(io.swagger.jaxrs.config.DefaultJaxrsConfig.class).asEagerSingleton();
    serve("/swaggerinit")
        .with(
            io.swagger.jaxrs.config.DefaultJaxrsConfig.class,
            ImmutableMap.of(
                "api.version", getCheVersion(),
                "swagger.api.title", "Eclipse Che",
                "swagger.api.basepath", "/api"));
  }

  private String getCheVersion() {
    try {
      URL url =
          BasicSwaggerConfigurationModule.class.getProtectionDomain().getCodeSource().getLocation();
      try (JarFile jar = new JarFile(new File(url.toURI()))) {
        final Manifest manifest = requireNonNull(jar.getManifest(), "Manifest must not be null");
        return manifest.getMainAttributes().getValue("Specification-Version");
      }
    } catch (Exception e) {
      LOG.error("Unable to retrieve implementation version from manifest file", e);
      return "unknown";
    }
  }
}
