#!/usr/bin/env bash

# Get environment variables to show up in SSH session
eval $(printenv | sed -n "s/^\([^=]\+\)=\(.*\)$/export \1=\2/p" | sed 's/"/\\\"/g' | sed '/=/s//="/' | sed 's/$/"/' >> /etc/profile)

pushd /home/site/wwwroot/assets > /dev/null

    pattern="index-*.js"

    files=( $(compgen -W "$pattern") )
    indexJs=$files

    sed -i 's|__VITE_API_URL__|'"$VITE_API_URL"'|g' "$indexJs"
    sed -i 's|__VITE_MSAL_CLIENT_ID__|'"$VITE_MSAL_CLIENT_ID"'|g' "$indexJs"
    sed -i 's|__VITE_MSAL_TENANT_ID__|'"$VITE_MSAL_TENANT_ID"'|g' "$indexJs"
    sed -i 's|__VITE_MSAL_SCOPE__|'"$VITE_MSAL_SCOPE"'|g' "$indexJs"
    sed -i 's|__VITE_VERSION__|'"$VITE_VERSION"'|g' "$indexJs"

popd > /dev/null

# starting sshd process
sed -i "s/SSH_PORT/$SSH_PORT/g" /etc/ssh/sshd_config
/usr/sbin/sshd

# replace occurence of PORT in config site file for nginx
sed -i "s/PORT/$PORT/g" /etc/nginx/sites-available/msdsite
ln -s /etc/nginx/sites-available/msdsite /etc/nginx/sites-enabled/msdsite

echo "Restarting nginx..."
service nginx restart
