#!/usr/bin/env ash
# setup fd-3 to point to the original stdout
exec 3>&1
# setup fd-4 to point to the original stderr
exec 4>&2

# get the prefix from SUPERVISOR_PROCESS_NAME environement variable
printf -v PREFIX "%-10.10s" ${SUPERVISOR_PROCESS_NAME}

# create a named pipe for stdout
mkfifo /tmp/stdout
# create a named pipe for stderr
mkfifo /tmp/stderr

# start a background process that reads from the named pipe and writes to the original stdout/stderr
perl -ne '$| = 1; print "'"${PREFIX}"' | $_"' < /tmp/stdout >&3 &
perl -ne '$| = 1; print "'"${PREFIX}"' | $_"' < /tmp/stderr >&4 &

# redirect stdout and stderr to the named pipes
exec 1> /tmp/stdout
exec 2> /tmp/stderr

# from here on everything that outputs to stdout/stderr will be prefixed
echo "I will be prefixed"
# don't forget to use exec 