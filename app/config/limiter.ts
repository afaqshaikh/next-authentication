import { RateLimiter } from "limiter";

export const Limiter = new RateLimiter({
    tokensPerInterval: 2,
    interval: "minute",
    fireImmediately: true
});

