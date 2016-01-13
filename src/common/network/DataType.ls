module.exports = class DataType
  # read: (view, index) => [ value, size ]
  # write: (view, index, value) => size
  # size: Number or (value) => size
  # verify: (value) => <throws error if invalid>
  (@name, @read, @write, @size, @verify) ->
    if @@[@name]? then throw new Error do
      "Data type '#{@name}' already defined"
    @@[@name] = this
  
  get-size: (value) ->
    if typeof! @size == \Function
      then @size value
      else @size
  
  @find = (name) -> @@[name]
  
  @find-or-throw = (name) ->
    if !(type = @@[name])?
      throw new Error "Unknown data type '#name'"
    type
  
  @define = -> new DataType ...


simple = (access, size, verify) ->
  * (view, index) ->
      * view["get#access"] index
        size
    (view, index, value) ->
      view["set#access"] index, value
      size
    size
    verify

check-int = (signed, bits) ->
  (value) !->
    if typeof! value != \Number
      throw new Error "Expected number, got '#{ typeof! value }'"
    if !Number.is-safe-integer
      throw new Error "Number '#value' is not an integer"
    
    min = if signed then -(1 << (bits - 1)) else 0
    max = (1 << bits - +signed) - 1
    if value < min or value > max
      throw new Error "Integer '#value' is not in valid range (#min - #max)"

check-is-number = (value) ->
  if typeof! value != \Number
    throw new Error "Expected number, got '#{ typeof! value }'"


DataType.define \byte,   ...simple \Uint8,   1, check-int false,  8
DataType.define \sbyte,  ...simple \Int8,    1, check-int  true,  8
DataType.define \short,  ...simple \Uint16,  2, check-int  true, 16
DataType.define \ushort, ...simple \Int16,   2, check-int false, 16
DataType.define \int,    ...simple \Uint32,  4, check-int  true, 32
DataType.define \uint,   ...simple \Int32,   4, check-int false, 32
DataType.define \float,  ...simple \Float32, 4, check-is-number
DataType.define \double, ...simple \Float64, 8, check-is-number
