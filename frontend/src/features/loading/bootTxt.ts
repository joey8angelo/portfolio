const bootTxt = `
Uncompressing Linux... done, booting the kernel.
[ 000% ] Booting Linux on physical CPU 0x0
[ 000% ] Initializing cgroup subsys cpu
[ 000% ] Initializing cgroup subsys cpuacct
[ 000% ] Linux version 3.18.10+ (dc4@dc4-XPS13-9333) (gcc version 4.8.3 20140303 (prerelease) (crosstool-NG linaro-1.13.1+bzr2650 - Linaro GCC 2014.03)) #775 PREEMPT Thu Apr 2 18:10:12 BST 2015
[ 000% ] CPU: ARMv6-compatible processor [410fb767] revision 7 (ARMv7), cr=00c5387d
[ 000% ] CPU: PIPT / VIPT nonaliasing data cache, VIPT nonaliasing instruction cache
[ 000% ] Machine model: Raspberry Pi Model B
[ 000% ] cma: Reserved 8 MiB at 0x0b800000
[ 000% ] Memory policy: Data cache writeback
[ 000% ] Built 1 zonelists in Zone order, mobility grouping on.  Total pages: 48768
[ 000% ] Kernel command line: dma.dmachans=0x7f35 bcm2708_fb.fbwidth=656 bcm2708_fb.fbheight=416 bcm2708.boardrev=0x2 bcm2708.serial=0xb51cb961 smsc95x.macaddr=B8:27:EB:1C:B9:61 bcm2708_fb.fbswap=1 sdhci-bcm2708.emmc_clock_freq=250000000 vc_mem.mem_base=0xec00000 vc_mem.mem_size=0x10000000  dwc_otg.lpm_enabe=0 console=ttyAMA0,115200 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline rootwait
[ 000% ] PID hash table entries: 1024 (order:0, 4096 bytes)
[ 000% ] Dentry cache hash table entries: 32768 (order: 5, 131072 bytes)
[ 000% ] Inode-cache hash table entries: 16384 (order: 4, 65536 bytes)
[ 000% ] Memory: 177372K/196608K available (5885K kernel code, 348K rwdata, 1868K rodata, 340K init, 733K bss, 19236K reserved)
[ 000% ] Virtual kernel memory layout:
[ 000% ]     vector  : 0xffff0000 - 0xffff1000   (   4 kB)
[ 000% ]     fixmap  : 0xffc00000 - 0xffe00000   (2048 kB)
[ 000% ]     vmalloc : 0xcc800000 - 0xff000000   ( 808 MB)
[ 000% ]     lowmem  : 0xc0000000 - 0xcc000000   ( 192 MB)
[ 000% ]     modules : 0xbf000000 - 0xc0000000   (  16 MB)
[ 000% ]       .text : 0xc0008000 - 0xc079a78c   (7754 kB)
[ 000% ]       .init : 0xc079b000 - 0xc07f0000   ( 340 kB)
[ 000% ]       .data : 0xc07f0000 - 0xc084711c   ( 349 kB)
[ 000% ]        .bss : 0xc084711c - 0xc08fe848   ( 734 kB)
[ 000% ] SLUB: HWalign=32, Order=0-3, MinObjects=0, CPUs=1, Nodes=1
[ 000% ] Preemptible hierarchical RCU implementation.
[ 000% ] NR_IRQS:522
[ 000% ] sched_clock: 32 bits at 1000kHz, resolution 1000ns, wraps every 2147483648000ns
[ 001% ] Switching to timer-based delay loop, resolution 1000ns
[ 001% ] Console: colour dummy device 80x30
[ 002% ] console [tty1] enabled
[ 003% ] Calibrating delay loop (skipped), value calculated using timer frequency.. 2.00 BogoMIPS (lpj=10000)
[ 003% ] pid_max: default: 32768 minimum: 301
[ 004% ] Mount-cache hash table entries: 1024 (order: 0, 4096 bytes)
[ 004% ] Mountpoint-cache hash table entries: 1024 (order: 0, 4096 bytes)
[ 005% ] Initializing cgroup subsys memory
[ 006% ] Initializing cgroup subsys devices
[ 006% ] Initializing cgroup subsys freezer
[ 007% ] Initializing cgroup subsys net_cls
[ 007% ] Initializing cgroup subsys blkio
[ 008% ] CPU: Testing write buffer coherency: ok
[ 009% ] ftrace: allocating 19229 entries in 57 pages
[ 009% ] Setting up static identity map for 0x553698 - 0x5536d0
[ 010% ] devtmpfs: initialized
[ 011% ] VFP support v0.3: implementor 41 architecture 1 part 20 variant b rev 5
[ 011% ] pinctrl core: initialized pinctrl subsystem
[ 012% ] NET: Registered protocol family 16
[ 012% ] DMA: preallocated 4096 KiB pool for atomic coherent allocations
[ 013% ] bcm2708.uart_clock = 3000000
[ 014% ] No ATAGs?
[ 014% ] hw-breakpoint: found 6 breakpoint and 1 watchpoint registers.
[ 015% ] hw-breakpoint: maximum watchpoint size is 4 bytes.
[ 015% ] mailbox: Broadcom VideoCore Mailbox driver
[ 016% ] bcm2708_vcio: mailbox at f200b880
[ 017% ] bcm_power: Broadcom power driver
[ 017% ] bcm_power_open() -> 0
[ 018% ] bcm_power_request(0, 8)
[ 019% ] bcm_mailbox_read -> 00000080, 0
[ 019% ] bcm_power_request -> 0
[ 020% ] Serial: AMBA PL011 UART driver
[ 020% ] dev:f1: ttyAMA0 at MMIO 0x20201000 (irq = 83, base_baud = 0) is a PL011 rev3
[ 021% ] console [ttyAMA0] enabled
[ 022% ] SCSI subsystem initialized
[ 022% ] usbcore: registered new interface driver usbfs
[ 023% ] usbcore: registered new interface driver hub
[ 023% ] usbcore: registered new device driver usb
[ 024% ] Switched to clocksource stc
[ 025% ] FS-Cache: Loaded
[ 025% ] CacheFiles: Loaded
[ 026% ] NET: Registered protocol family 2
[ 026% ] TCP established hash table entries: 2048 (order: 1, 8192 bytes)
[ 027% ] TCP bind hash table entries: 2048 (order: 1, 8192 bytes)
[ 028% ] TCP: Hash tables configured (established 2048 bind 2048)
[ 028% ] TCP: reno registered
[ 029% ] UDP hash table entries: 256 (order: 0, 4096 bytes)
[ 030% ] UDP-Lite hash table entries: 256 (order: 0, 4096 bytes)
[ 030% ] NET: Registered protocol family 1
[ 031% ] RPC: Registered named UNIX socket transport module.
[ 031% ] RPC: Registered udp transport module.
[ 032% ] RPC: Registered tcp transport module.
[ 033% ] RPC: Registered tcp NFSv4.1 backchannel transport module.
[ 033% ] bcm2708_dma: DMA manager at f2007000
[ 034% ] vc-mem: phys_addr:0x00000000 mem_base=0x0ec00000 mem_size:0x10000000(256 MiB)
[ 034% ] futex hash table entries: 256 (order: -1, 3072 bytes)
[ 035% ] audit: initializing netlink subsys (disabled)
[ 036% ] audit: type=2000 audit(1.030:1): initialized
[ 036% ] VFS: Disk quotas dquot_6.5.2
[ 037% ] Dquot-cache hash table entries: 1024 (order 0, 4096 bytes)
[ 038% ] FS-Cache: Netfs 'nfs' registered for caching
[ 038% ] NFS: Registering the id_resolver key type
[ 039% ] Key type id_resolver registered
[ 039% ] Key type id_legacy registered
[ 040% ] msgmni has been set to 362
[ 041% ] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
[ 041% ] io scheduler noop registered
[ 042% ] io scheduler deadline registered (default)
[ 042% ] io scheduler cfq registered
[ 043% ] BCM2708FB: allocated DMA memory 4bc00000
[ 044% ] BCM2708FB: allocated DMA channel 0 @ f2007000
[ 044% ] Console: switching to colour frame buffer device 82x26
[ 045% ] bcm2708-dmaengine bcm2708-dmaengine: Load BCM2835 DMA engine driver
[ 046% ] uart-pl011 dev:f1: no DMA platform data
[ 046% ] vc-cma: Videocore CMA driver
[ 047% ] vc-cma: vc_cma_base      = 0x00000000
[ 047% ] vc-cma: vc_cma_size      = 0x00000000 (0 MiB)
[ 048% ] vc-cma: vc_cma_initial   = 0x00000000 (0 MiB)
[ 049% ] brd: module loaded
[ 049% ] loop: module loaded
[ 050% ] vchiq: vchiq_init_state: slot_zero = 0xcb800000, is_master = 0
[ 050% ] Loading iSCSI transport class v2.0-870.
[ 051% ] usbcore: registered new interface driver smsc95xx
[ 052% ] dwc_otg: version 3.00a 10-AUG-2012 (platform bus)
[ 052% ] Core Release: 2.80a
[ 053% ] Setting default values for core params
[ 053% ] Finished setting default values for core params
[ 054% ] Using Buffer DMA mode
[ 055% ] Periodic Transfer Interrupt Enhancement - disabled
[ 055% ] Multiprocessor Interrupt Enhancement - disabled
[ 056% ] OTG VER PARAM: 0, OTG VER FLAG: 0
[ 057% ] Dedicated Tx FIFOs mode
[ 057% ] WARN::dwc_otg_hcd_init:1047: FIQ DMA bounce buffers: virt = 0xcbc14000 dma = 0x4bc14000 len=9024
[ 058% ] FIQ FSM acceleration enabled for :
[ 058% ] Non-periodic Split Transactions
[ 059% ] Periodic Split Transactions
[ 060% ] High-Speed Isochronous Endpoints
[ 060% ] WARN::hcd_init_fiq:412: FIQ on core 0 at 0xc03fad8c
[ 061% ] WARN::hcd_init_fiq:413: FIQ ASM at 0xc03fb064 length 36
[ 061% ] WARN::hcd_init_fiq:438: MPHI regs_base at 0xcc806000
[ 062% ] dwc_otg bcm2708_usb: DWC OTG Controller
[ 063% ] dwc_otg bcm2708_usb: new USB bus registered, assigned bus number 1
[ 063% ] dwc_otg bcm2708_usb: irq 32, io mem 0x00000000
[ 064% ] Init: Port Power? op_state=1
[ 065% ] Init: Power Port (0)
[ 065% ] usb usb1: New USB device found, idVendor=1d6b, idProduct=0002
[ 066% ] usb usb1: New USB device strings: Mfr=3, Product=2, SerialNumber=1
[ 066% ] usb usb1: Product: DWC OTG Controller
[ 067% ] usb usb1: Manufacturer: Linux 3.18.10+ dwc_otg_hcd
[ 068% ] usb usb1: SerialNumber: bcm2708_usb
[ 068% ] hub 1-0:1.0: USB hub found
[ 069% ] hub 1-0:1.0: 1 port detected
[ 069% ] usbcore: registered new interface driver usb-storage
[ 070% ] mousedev: PS/2 mouse device common for all mice
[ 071% ] bcm2835-cpufreq: min=700000 max=700000
[ 071% ] sdhci: Secure Digital Host Controller Interface driver
[ 072% ] sdhci: Copyright(c) Pierre Ossman
[ 073% ] DMA channels allocated for the MMC driver
[ 073% ] Load BCM2835 MMC driver
[ 074% ] sdhci-pltfm: SDHCI platform and OF driver helper
[ 074% ] ledtrig-cpu: registered to indicate activity on CPUs
[ 075% ] hidraw: raw HID events driver (C) Jiri Kosina
[ 076% ] usbcore: registered new interface driver usbhid
[ 076% ] usbhid: USB HID core driver
[ 077% ] TCP: cubic registered
[ 077% ] Initializing XFRM netlink socket
[ 078% ] NET: Registered protocol family 17
[ 079% ] Key type dns_resolver registered
[ 079% ] registered taskstats version 1
[ 080% ] vc-sm: Videocore shared memory driver
[ 080% ] [vc_sm_connected_init]: start
[ 081% ] [vc_sm_connected_init]: end - returning 0
[ 082% ] Waiting for root device /dev/mmcblk0p2...
[ 082% ] Indeed it is in host mode hprt0 = 00021501
[ 083% ] mmc0: host does not support reading read-only switch, assuming write-enable
[ 084% ] mmc0: new high speed SDHC card at address b368
[ 084% ] mmcblk0: mmc0:b368 SMI   15.0 GiB
[ 085% ]  mmcblk0: p1 p2
[ 085% ] EXT4-fs (mmcblk0p2): INFO: recovery required on readonly filesystem
[ 086% ] EXT4-fs (mmcblk0p2): write access will be enabled during recovery
[ 087% ] EXT4-fs (mmcblk0p2): recovery complete
[ 087% ] EXT4-fs (mmcblk0p2): mounted filesystem with ordered data mode. Opts: (null)
[ 088% ] usb 1-1: new high-speed USB device number 2 using dwc_otg
[ 088% ] VFS: Mounted root (ext4 filesystem) readonly on device 179:2.
[ 089% ] Indeed it is in host mode hprt0 = 00001101
[ 090% ] devtmpfs: mounted
[ 090% ] Freeing unused kernel memory: 340K (c079b000 - c07f0000)
[ 091% ] usb 1-1: New USB device found, idVendor=0424, idProduct=9512
[ 092% ] usb 1-1: New USB device strings: Mfr=0, Product=0, SerialNumber=0
[ 092% ] hub 1-1:1.0: USB hub found
[ 093% ] hub 1-1:1.0: 3 ports detected
[ 093% ] usb 1-1.1: new high-speed USB device number 3 using dwc_otg
[ 094% ] usb 1-1.1: New USB device found, idVendor=0424, idProduct=ec00
[ 095% ] usb 1-1.1: New USB device strings: Mfr=0, Product=0, SerialNumber=0
[ 095% ] smsc95xx v1.0.4
[ 096% ] smsc95xx 1-1.1:1.0 eth0: register 'smsc95xx' at usb-bcm2708_usb-1.1, smsc95xx USB 2.0 Ethernet, b8:27:eb:1c:b9:61
[ 096% ] udevd[159]: starting version 175
[ 097% ] EXT4-fs (mmcblk0p2): re-mounted. Opts: (null)
[ 098% ] EXT4-fs (mmcblk0p2): re-mounted. Opts: (null)
[ 098% ] random: nonblocking pool is initialized
[ 099% ] Driver for 1-wire Dallas network protocol.
[ 100% ] i2c /dev entries driver
`;
export default bootTxt;
