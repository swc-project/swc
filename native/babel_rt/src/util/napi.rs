use anyhow::bail;

pub(crate) fn status_to_error(s: napi::Status) -> Result<(), anyhow::Error> {
    match s {
        napi::Status::Ok => Ok(()),
        napi::Status::InvalidArg => {
            bail!("invalid arguments")
        }
        napi::Status::ObjectExpected => {
            bail!("expected an object")
        }
        napi::Status::StringExpected => {
            bail!("expected a string")
        }
        napi::Status::NameExpected => {
            bail!("expected a name")
        }
        napi::Status::FunctionExpected => {
            bail!("expected a function")
        }
        napi::Status::NumberExpected => {
            bail!("expected a number")
        }
        napi::Status::BooleanExpected => {
            bail!("expected a boolean")
        }
        napi::Status::ArrayExpected => {
            bail!("expected an array")
        }
        napi::Status::GenericFailure => {
            bail!("failed with unknown reason")
        }
        napi::Status::PendingException => {
            bail!("pending exception")
        }
        napi::Status::Cancelled => {
            bail!("cancelled")
        }
        napi::Status::EscapeCalledTwice => {
            bail!("escape called twice")
        }
        napi::Status::HandleScopeMismatch => {
            bail!("scope of the handle didn't match")
        }
        napi::Status::CallbackScopeMismatch => {
            bail!("scope of the callback didn't match")
        }
        napi::Status::QueueFull => {
            bail!("queue is full")
        }
        napi::Status::Closing => {
            bail!("closing")
        }
        napi::Status::BigintExpected => {
            bail!("expected a big integer")
        }
        napi::Status::DateExpected => {
            bail!("expected a date object")
        }
        napi::Status::ArrayBufferExpected => {
            bail!("expected an array buffer")
        }
        napi::Status::DetachableArraybufferExpected => {
            bail!("expected a detachable array buffer")
        }
        napi::Status::WouldDeadlock => {
            bail!("deadlock")
        }
        napi::Status::Unknown => {
            bail!("unknown")
        }
    }
}
