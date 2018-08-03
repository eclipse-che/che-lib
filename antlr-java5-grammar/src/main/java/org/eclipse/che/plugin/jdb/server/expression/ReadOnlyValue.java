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
package org.eclipse.che.plugin.jdb.server.expression;

import com.sun.jdi.Value;

/** @author andrew00x */
public class ReadOnlyValue implements ExpressionValue {
  private final Value value;

  public ReadOnlyValue(Value value) {
    this.value = value;
  }

  @Override
  public Value getValue() {
    return value;
  }

  @Override
  public void setValue(Value value) {
    throw new ExpressionException("Value is read only. ");
  }
}
