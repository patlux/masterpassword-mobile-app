#!/bin/bash

expoCliParams=()
[ "$CI" = "true" ] && expoCliParams+=(--non-interactive)

echo "expo publish \"${expoCliParams[@]}\""
expo publish ${expoCliParams[@]} && \
  expo build:android ${expoCliParams[@]} --type apk --no-publish --no-wait
