interval-id = null

self.add-event-listener \message, ({ data: interval }) !->
  if interval > 0
    interval-id = set-interval do
      !-> self.post-message interval
      interval
  else clear-interval interval-id
