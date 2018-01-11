/*
 * Copyright (c) 2012-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
package org.eclipse.che.swagger.deploy;

import com.google.inject.AbstractModule;
import com.google.inject.multibindings.Multibinder;
import com.google.inject.name.Names;
import org.apache.commons.lang3.StringUtils;

/** @author Sergii Kabashniuk */
public class DocsModule extends AbstractModule {

  @Override
  protected void configure() {

    bind(org.eclipse.che.swagger.rest.SwaggerSpecificationService.class);
    bind(org.eclipse.che.swagger.rest.SwaggerSerializers.class).asEagerSingleton();
    // trim is a fake to make this module dependent to commons lang3 and have correct version. this
    // is need for dependency convergence.
    final Multibinder<Class> ignoredCodenvyJsonClasses =
        Multibinder.newSetBinder(
            binder(), Class.class, Names.named(StringUtils.trim("che.json.ignored_classes")));
    ignoredCodenvyJsonClasses.addBinding().toInstance(io.swagger.models.Swagger.class);
  }
}
