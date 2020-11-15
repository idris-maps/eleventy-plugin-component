rm -rf _site \
&& npm run build:11ty \
&& mkdir _site/js \
&& npm run build:components
