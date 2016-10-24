#!/bin/bash
set -ev
#-------------------------------------------------------------------------------
# Generate the default stormpath behaviour
#-------------------------------------------------------------------------------
cd "$HOME"/app
yo jhipster-stormpath default --force --no-insight
