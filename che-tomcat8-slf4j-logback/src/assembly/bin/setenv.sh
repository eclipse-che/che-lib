#
# Copyright (c) 2012-2016 Codenvy, S.A.
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the Eclipse Public License v1.0
# which accompanies this distribution, and is available at
# http://www.eclipse.org/legal/epl-v10.html
#
# Contributors:
#   Codenvy, S.A. - initial API and implementation
#

if [ -z "${CHE_LOCAL_CONF_DIR}" ]; then
    echo "Need to set CHE_LOCAL_CONF_DIR"
    exit 1
fi

#Global JAVA options
[ -z "${JAVA_OPTS}" ]  && JAVA_OPTS="-Xms256m -Xmx2048m -Djava.security.egd=file:/dev/./urandom"

#Global LOGS DIR
[ -z "${CHE_LOGS_DIR}" ]  && CHE_LOGS_DIR="$CATALINA_HOME/logs"

[ -z "${CHE_LOGS_LEVEL}" ]  && CHE_LOGS_LEVEL="INFO"

[ -z "${JPDA_ADDRESS}" ]  && JPDA_ADDRESS="8000"

#Tomcat options
[ -z "${CATALINA_OPTS}" ]  && CATALINA_OPTS="-Dcom.sun.management.jmxremote  \
                                             -Dcom.sun.management.jmxremote.ssl=false \
                                             -Dcom.sun.management.jmxremote.authenticate=false \
                                             -Dche.local.conf.dir=${CHE_LOCAL_CONF_DIR}"

#Class path
CLASSPATH="${CATALINA_HOME}/conf/:${JAVA_HOME}/lib/tools.jar"
if [ ! -z "${TOMCAT_CLASSPATH}" ]; then
 CLASSPATH=${CLASSPATH}:${TOMCAT_CLASSPATH}
fi


export JAVA_OPTS="$JAVA_OPTS  -Dche.logs.dir=${CHE_LOGS_DIR} -Dche.logs.level=${CHE_LOGS_LEVEL}"
