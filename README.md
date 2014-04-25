# NodeBot Wars Client

This process runs on every robot in the battle.  It connects to the game server and sends/receives state.

## Prequisites

Make sure your system is up to date:

```
apt-get update
apt-get upgrade
```

Install required packages:

```
apt-get install git-core build-essential device-tree-compiler
```

### I've got a Dual Shock 4 Controller:

Install dependencies:

```
apt-get install libudev-dev libical-dev libreadline-dev libglib2.0-0 libglib2.0-dev libdbus-1-dev libusb-dev libusb-1.0.0-dev python-dbus
```

Install a version of bluez that supports the ds4 (the version in apt at the time of writing is too old):

```
cd /usr/src
wget https://www.kernel.org/pub/linux/bluetooth/bluez-5.18.tar.gz
tar -xzf bluez-5.18.tar.gz
cd bluez-5.18
./configure --disable-systemd
make
make install
```

Add to /etc/fstab

```
debugfs /sys/kernel/debug debugfs 0 0
```
