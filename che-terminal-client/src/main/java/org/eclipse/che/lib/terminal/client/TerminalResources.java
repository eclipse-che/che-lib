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
package org.eclipse.che.lib.terminal.client;

import com.google.gwt.resources.client.ClientBundle;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.resources.client.TextResource;

/** @author Alexander Andrienko */
public interface TerminalResources extends ClientBundle {
  @CssResource.NotStrict
  @Source({"xterm.css"})
  CssResource getTerminalStyle();

  @Source("xterm.js")
  TextResource xtermScript();

  @Source("addons/fit/fit.js")
  TextResource fitScript();
}
