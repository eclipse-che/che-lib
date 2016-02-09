/*******************************************************************************
 * Copyright (c) 2012-2016 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 *******************************************************************************/
package org.eclipse.che.swagger.rest;

import io.swagger.jaxrs.listing.ApiListingResource;

import javax.servlet.ServletConfig;
import javax.ws.rs.Path;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;


@Path("/docs")
public class SwaggerSpecificationService extends ApiListingResource {
    @Override
    public Response getListingYaml(@Context Application app, @Context ServletConfig sc, @Context HttpHeaders headers,
                                   @Context UriInfo uriInfo) {
        return Response.status(Response.Status.NOT_IMPLEMENTED).build();
    }
}
