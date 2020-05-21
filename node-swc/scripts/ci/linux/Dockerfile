FROM centos:7

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain nightly --profile minimal -y
RUN ln -s "${HOME}"/.cargo/bin/* /usr/local/bin

ENV CARGO_INCREMENTAL=0


RUN yum -y update; yum clean all
RUN yum -y install gcc make gcc-c++ epel-release; yum groupinstall "Development Tools"; yum clean all

ARG NODE_VERSION
RUN curl -sL https://rpm.nodesource.com/setup_${NODE_VERSION} | bash -
RUN yum -y install nodejs; yum clean all

CMD ["sh"] 
