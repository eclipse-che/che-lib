/*******************************************************************************
 * Copyright (c) 2012-2017 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 *******************************************************************************/
package org.eclipse.che.swagger.deploy;

import com.google.common.collect.ImmutableMap;
import com.google.inject.servlet.ServletModule;

/**
 * Module provide basic swagger configuration
 *
 * @author Sergii Kabashnyuk
 */
public class BasicSwaggerConfigurationModule extends ServletModule {
    @Override
    protected void configureServlets() {
        bind(io.swagger.jaxrs.config.DefaultJaxrsConfig.class).asEagerSingleton();
        serve("/swaggerinit").with(io.swagger.jaxrs.config.DefaultJaxrsConfig.class, ImmutableMap
                .of("api.version", "1.0",
                    "swagger.api.title", "Eclipse Che",
                    "swagger.api.basepath", "/api"
                   ));
    }
}
