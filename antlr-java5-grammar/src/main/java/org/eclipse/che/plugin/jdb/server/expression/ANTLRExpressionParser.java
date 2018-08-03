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
import org.antlr.runtime.ANTLRStringStream;
import org.antlr.runtime.CommonTokenStream;
import org.antlr.runtime.RecognitionException;
import org.antlr.runtime.tree.CommonTreeNodeStream;

/**
 * ANTLR based implementation of ExpressionParser.
 *
 * @author andrew00x
 */
public final class ANTLRExpressionParser extends ExpressionParser {
  private CommonTreeNodeStream nodes;

  public ANTLRExpressionParser(String expression) {
    super(expression);
  }

  @Override
  public Value evaluate(Evaluator ev) {
    try {
      if (nodes == null) {
        parse();
      } else {
        nodes.reset();
      }
      JavaTreeParser walker = new JavaTreeParser(nodes, ev);
      return walker.evaluate();
    } catch (RecognitionException e) {
      throw new ExpressionException(e.getMessage(), e);
    }
  }

  private void parse() throws RecognitionException {
    JavaLexer lexer = new JavaLexer(new ANTLRStringStream(getExpression()));
    CommonTokenStream tokens = new CommonTokenStream(lexer);
    JavaParser parser = new JavaParser(tokens);
    nodes = new CommonTreeNodeStream(parser.expression().getTree());
  }
}
