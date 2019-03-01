# jpi-errors
Error classes and conversion utilities for
[Jpi](https://www.npmjs.com/package/jpi), built using
[Nani](https://www.npmjs.com/package/nani).

## Base Class: JpiError
This module provides `JpiError`-- a base class for all errors defined by Jpi,
and potentially your own application-defined errors. `JpiError` extends
[`NaniError`](https://sripberger.github.io/nani/#nanierror), and both it and all
of its subclasses in this project can be easily created using the `NaniError`
constructor pattern.

This class is important for several reasons which we'll get to, but first we
have to discuss what Jpi does with thrown errors.


## The Jpi Error Mechanism
When a middleware registered in Jpi throws, it triggers an error handling
mechanism that automatically converts your error into a ready-to-serialize
object compliant with the
[JSON-RPC 2.0 standard](https://www.jsonrpc.org/specification).

Since every such error must have a well-defined integer error code, Jpi will
check all thrown errors for two criteria before converting them:

- Is the error a `JpiError`? (See
  [Nani.is](https://sripberger.github.io/nani/#is))
- Does the error have an integer `code` property?

Unless both of these are true, Jpi assumes that the error does *not* have a
well-defined integer error code, and proceeds to wrap it inside of a generic
`ServerError` with the code `-32000`. Clients will still receive the original
error, but it will appear as the `cause` of the `ServerError`, instead of as
a top-level error.

Most of the time this is actually what you want. Unless your clients should take
responsibility for an error, you don't want to confuse things by adding more
public-facing codes that they don't and shouldn't care about.  When they see
the generic `ServerError` with `-32000`, they know the problem is in the server.


## Application-Defined Errors
In some cases, however, you *do* want to define a new kind of error that your
clients have to deal with-- authentication failure, permission denial, and
database-layer timeouts, just to name a few. What kinds of public-facing errors
you need will vary wildly based on what kind of app you're making, so Jpi
doesn't bother trying to define them for you.

To define a new public-facing error code, simply meet the above criteria by
inheriting from `JpiError` and setting an integer code property on your
subclass's constructor. You will probably *also* want to namespace your custom
`JpiError`s as discussed
[here](https://www.npmjs.com/package/nani#namespacing-your-errors) to avoid
collisions with other organizations/projects using Jpi:

```js
const { JpiError } = require('jpi-errors');

// Custom Server Error namespace class.
class MyServerError extends JpiError {}

// Class for authentication failures.
class AuthenticationError extends MyServerError {
	static getDefaultMessage() {
		'Authentication failed';
	}
}
AuthenticationError.code = 42

// Class for permission denial.
class PermissionDeniedError extends MyServerError {
	static getDefaultMessage(info) {
		if (!info.op) return 'Permission denied';
		return 'Permission denied for operation \'${info.op}\'';
	}
}
PermissionDeniedError.code = 43;

// Export those classes...
module.exports = {
	MyServerError,
	AuthenticationError,
	PermissionDeniedError
};
```

As for choosing error codes, you can generally do whatever you want, though
you'll probably want to keep them all in one place or otherwise document them,
so any clients can easily look them up.

Any error codes less than `-33000` are reserved, however, according to the
JSON-RPC standard. `-32000` is used by Jpi iself, as described above, while
others in this range appear in this library as well. Read below for more
information.


## Standard JSON-RPC Errors
In addition to the classes already described, this package includes classes
for errors defined by the JSON-RPC standard:

- `ParseError`: Code `-32700`, thrown when Jpi fails to parse a request body as
  JSON.
- `InvalidRequestError`: Code `-32600`, thrown when Jpi receives valid JSON that
  is not a valid JSON-RPC Request object.
- `MethodNotFoundError`: Code `-32601`, thrown when Jpi receives a valid
  JSON-RPC Request object that specified a method that has not been registered.
- `InvalidParamsError`: Code `-32602`, not actually thrown by Jpi, as Jpi does
  not come with a schema system. You'll want to throw this one yourself from a
  middleware to indicate that the JSON-RPC request specified a method that has
  been registered, but one or more params were invalid.
- `InternalError`: Code `-32063`, not actually thrown by Jpi. To be honest I'm
  not sure what this is for, but I included it anyway because it's in the
  standard.  ¯\\_(ツ)_/¯

All of these classes inherit from `JpiError` and thus `NaniError`. You may or
may not want to check for them yourself when writing a Jpi client, but
aside from the `InvalidParamsError` you should not normally need to throw them
yourself.

## Conversion Utilities
As Jpi is a JSON-RPC framework, it needs some way of converting between JS error
instances into JSON-RPC-compliant error objects. The following functions are
included in this package for this purpose:

- `toObject`: Converts an error instance into a JSON-RPC Error object.
- `fromObject`: Convers a JSON-RPC Error object to an error instance.

`toObject` is used by Jpi itself, whereas clients will want to use `fromObject`
to rebuild error structures built by Jpi.

Note that Error instances output by `fromObject` will *not* have any stack
frames, unless they were included in the input. This is because, without stack
traces from the original errors, there isn't really any useful information
`fromObject` can find out about where the errors *originally* came from.

If you want to rethrow any error that you rebuild through `fromObject`, you
should probably set it as the cause of a new error, so you can have a useful
stack trace.
