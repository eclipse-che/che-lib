@REM
@REM Copyright (c) 2012-2018 Red Hat, Inc.
@REM This program and the accompanying materials are made
@REM available under the terms of the Eclipse Public License 2.0
@REM which is available at https://www.eclipse.org/legal/epl-2.0/
@REM
@REM SPDX-License-Identifier: EPL-2.0
@REM
@REM Contributors:
@REM   Red Hat, Inc. - initial API and implementation
@REM

@echo off
if "%CHE_LOCAL_CONF_DIR%"==""   (
   echo Need to set CHE_LOCAL_CONF_DIR
   echo Press enter to exit...
   pause >nul
   exit
)

if "%JAVA_OPTS%"=="" (set JAVA_OPTS=-Xms256m -Xmx2048m)

if "%CHE_LOGS_DIR%"=="" (set CHE_LOGS_DIR=%CATALINA_HOME%\logs)

if "%CHE_LOGS_LEVEL%"=="" (set CHE_LOGS_LEVEL=INFO)

if "%JPDA_ADDRESS%"=="" (set JPDA_ADDRESS=8000)

if "%CATALINA_OPTS%"=="" (set CATALINA_OPTS=-Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.authenticate=false -Dche.local.conf.dir=%CHE_LOCAL_CONF_DIR%)

if "%CLASSPATH%"=="" (set CLASSPATH=%CATALINA_HOME%\conf\;%JAVA_HOME%\lib\tools.jar)

set LOG_OPTS=-Dche.logs.dir=%CHE_LOGS_DIR% -Dche.logs.level=%CHE_LOGS_LEVEL% -Djuli-logback.configurationFile=file:%CATALINA_HOME%\conf\tomcat-logger.xml

set JAVA_OPTS=%JAVA_OPTS% %LOG_OPTS%
echo "======="
echo %JAVA_OPTS%
echo "======="
