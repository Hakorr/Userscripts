# [Flightradar24] Bypass timeout

Bypasses the 15-min timeout

## Debugging

If the script is broken, you can check out the [bundle.js]() to figure out what to block. Search for words like 

`exit_map()` `blackoutMapForTimeout` `ctaPromoBtn` `.session-timeout-modal .cta-group .trial` `value: '/timeout-overlay'`
