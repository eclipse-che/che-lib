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

import com.sun.jdi.ClassNotLoadedException;
import com.sun.jdi.InvalidStackFrameException;
import com.sun.jdi.InvalidTypeException;
import com.sun.jdi.LocalVariable;
import com.sun.jdi.StackFrame;
import com.sun.jdi.Value;

/** @author andrew00x */
public class LocalValue implements ExpressionValue {
  private final StackFrame jdiStackFrame;
  private final LocalVariable variable;
  private Value value;

  public LocalValue(StackFrame jdiStackFrame, LocalVariable variable) {
    this.jdiStackFrame = jdiStackFrame;
    this.variable = variable;
  }

  @Override
  public Value getValue() {
    if (value == null) {
      try {
        value = jdiStackFrame.getValue(variable);
      } catch (IllegalArgumentException | InvalidStackFrameException e) {
        throw new ExpressionException(e.getMessage(), e);
      }
    }
    return value;
  }

  @Override
  public void setValue(Value value) {
    try {
      jdiStackFrame.setValue(variable, value);
    } catch (InvalidTypeException | ClassNotLoadedException e) {
      throw new ExpressionException(e.getMessage(), e);
    }
    this.value = value;
  }
}
