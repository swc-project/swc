use std::{io, time::Duration};

#[derive(Debug, thiserror::Error)]
pub(crate) enum ReadFromStdinWithTimeoutError {
    #[error("IO error while reading from stdin: {0}")]
    Io(#[from] io::Error),

    #[error("Timeout of {0:?} exceeded while reading from stdin")]
    Timeout(Duration),

    #[cfg(windows)]
    #[error("Invalid timeout. Timeout may not exceed u32::MAX milliseconds")]
    TimeoutInvalid,
}

impl ReadFromStdinWithTimeoutError {
    #[cfg(windows)]
    fn other<S>(s: S) -> Self
    where
        S: Into<String>,
    {
        Self::Io(io::Error::new(io::ErrorKind::Other, s.into()))
    }
}

pub(crate) fn read_from_stdin_with_timeout<W>(
    writer: &mut W,
    poll_duration: Duration,
    timeout: Duration,
) -> Result<u64, ReadFromStdinWithTimeoutError>
where
    W: io::Write,
{
    wait_for_stdin_with_timeout(poll_duration, timeout)?;
    let mut stdin = io::stdin().lock();
    let nbytes = io::copy(&mut stdin, writer)?;
    Ok(nbytes)
}

#[cfg(unix)]
fn wait_for_stdin_with_timeout(
    poll_duration: Duration,
    timeout: Duration,
) -> Result<(), ReadFromStdinWithTimeoutError> {
    use std::time::Instant;

    use mio::{unix::SourceFd, Events, Interest, Poll, Token};

    const EVENTS_BUFFER_CAPACITY: usize = 32;
    const STDIN: i32 = 0;
    const TOKEN: Token = Token(0);

    let now = Instant::now();

    let mut poll = Poll::new()?;
    let mut events = Events::with_capacity(EVENTS_BUFFER_CAPACITY);
    let mut source_fd = SourceFd(&STDIN);
    poll.registry()
        .register(&mut source_fd, TOKEN, Interest::READABLE)?;

    loop {
        if now.elapsed() > timeout {
            return Err(ReadFromStdinWithTimeoutError::Timeout(timeout));
        }
        poll.poll(&mut events, Some(poll_duration))?;
        if events.iter().count() > 0 {
            return Ok(());
        }
    }
}

#[cfg(windows)]
fn wait_for_stdin_with_timeout(
    _poll_duration: Duration,
    timeout: Duration,
) -> Result<(), ReadFromStdinWithTimeoutError> {
    use windows::Win32::{
        Foundation::{WAIT_FAILED, WAIT_TIMEOUT},
        Storage::FileSystem::FlushFileBuffers,
        System::{
            Console::{GetStdHandle, STD_INPUT_HANDLE},
            Threading::{WaitForSingleObject, WAIT_OBJECT_0},
        },
    };

    let timeout_ms = u32::try_from(timeout.as_millis())
        .map_err(|_| ReadFromStdinWithTimeoutError::TimeoutInvalid)?;

    unsafe {
        let handle = GetStdHandle(STD_INPUT_HANDLE).map_err(|e| {
            ReadFromStdinWithTimeoutError::other(format!(
                "Failed to get HANDLE to stdin. Error: {}",
                e
            ))
        })?;

        let _ = FlushFileBuffers(handle);

        let ret = WaitForSingleObject(handle, timeout_ms);
        if ret == WAIT_OBJECT_0 {
            Ok(())
        } else if ret == WAIT_TIMEOUT.0 {
            Err(ReadFromStdinWithTimeoutError::Timeout(timeout))
        } else if ret == WAIT_FAILED.0 {
            Err(ReadFromStdinWithTimeoutError::other(
                "Failed to wait on stdin",
            ))
        } else {
            Err(ReadFromStdinWithTimeoutError::other(
                "Failed to wait on stdin",
            ))
        }
    }
}

#[cfg(all(not(unix), not(windows)))]
fn wait_for_stdin_with_timeout(
    _poll_duration: Duration,
    _timeout: Duration,
) -> Result<(), ReadFromStdinWithTimeoutError> {
    Ok(())
}
