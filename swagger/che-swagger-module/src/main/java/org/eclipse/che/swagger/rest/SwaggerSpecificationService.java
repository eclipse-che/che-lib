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
package org.eclipse.che.swagger.rest;

import io.swagger.jaxrs.listing.ApiListingResource;
import io.swagger.util.Yaml;

import com.google.common.base.Strings;

import org.apache.commons.lang3.StringUtils;

import javax.servlet.ServletConfig;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;


@Path("/docs/swagger.{type:json|yaml}")
public class SwaggerSpecificationService extends ApiListingResource {

    @Override
    public Response getListing(@Context Application app, @Context ServletConfig sc, @Context HttpHeaders headers,
                                   @Context UriInfo uriInfo, @PathParam("type") String type) {
        if (type.trim().equalsIgnoreCase("yaml")) {
            return Response.status(Response.Status.NOT_IMPLEMENTED).build();
        }
        return super.getListing(app, sc, headers, uriInfo, type);
    }
}
