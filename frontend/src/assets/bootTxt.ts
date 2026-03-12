const bootTxt = `Uncompressing Linux... done, booting the kernel.
[ 000% ] Initializing cgroup subsys cpu
[ 000% ] Linux version 3.18.10+ (dc4@dc4-XPS13-9333) (gcc version 4.8.3 20140303 (prerelease) (crosstool-NG linaro-1.13.1+bzr2650 - Linaro GCC 2014.03)) #775 PREEMPT Thu Apr 2 18:10:12 BST 2015
[ 000% ] CPU: PIPT / VIPT nonaliasing data cache, VIPT nonaliasing instruction cache
[ 000% ] cma: Reserved 8 MiB at 0x0b800000
[ 000% ] Built 1 zonelists in Zone order, mobility grouping on.  Total pages: 48768
[ 000% ] PID hash table entries: 1024 (order: 0, 4096 bytes)
[ 000% ] Inode-cache hash table entries: 16384 (order: 4, 65536 bytes)
[ 000% ] Virtual kernel memory layout:
[ 000% ]     fixmap  : 0xffc00000 - 0xffe00000   (2048 kB)
[ 000% ]     lowmem  : 0xc0000000 - 0xcc000000   ( 192 MB)
[ 000% ]       .text : 0xc0008000 - 0xc079a78c   (7754 kB)
[ 000% ]       .data : 0xc07f0000 - 0xc084711c   ( 349 kB)
[ 000% ] SLUB: HWalign=32, Order=0-3, MinObjects=0, CPUs=1, Nodes=1
[ 000% ] NR_IRQS:522
[ 001% ] Switching to timer-based delay loop, resolution 1000ns
[ 002% ] console [tty1] enabled
[ 003% ] pid_max: default: 32768 minimum: 301
[ 004% ] Mountpoint-cache hash table entries: 1024 (order: 0, 4096 bytes)
[ 006% ] Initializing cgroup subsys devices
[ 007% ] Initializing cgroup subsys net_cls
[ 008% ] CPU: Testing write buffer coherency: ok
[ 009% ] Setting up static identity map for 0x553698 - 0x5536d0
[ 011% ] VFP support v0.3: implementor 41 architecture 1 part 20 variant b rev 5
[ 012% ] NET: Registered protocol family 16
[ 013% ] bcm2708.uart_clock = 3000000
[ 014% ] hw-breakpoint: found 6 breakpoint and 1 watchpoint registers.
[ 016% ] mailbox: Broadcom VideoCore Mailbox driver
[ 017% ] bcm_power: Broadcom power driver
[ 018% ] bcm_power_request(0, 8)
[ 019% ] bcm_power_request -> 0
[ 020% ] dev:f1: ttyAMA0 at MMIO 0x20201000 (irq = 83, base_baud = 0) is a PL011 rev3
[ 022% ] SCSI subsystem initialized
[ 023% ] usbcore: registered new interface driver hub
[ 024% ] Switched to clocksource stc
[ 025% ] CacheFiles: Loaded
[ 027% ] TCP established hash table entries: 2048 (order: 1, 8192 bytes)
[ 028% ] TCP: Hash tables configured (established 2048 bind 2048)
[ 029% ] UDP hash table entries: 256 (order: 0, 4096 bytes)
[ 030% ] NET: Registered protocol family 1
[ 032% ] RPC: Registered udp transport module.
[ 033% ] RPC: Registered tcp NFSv4.1 backchannel transport module.
[ 034% ] vc-mem: phys_addr:0x00000000 mem_base=0x0ec00000 mem_size:0x10000000(256 MiB)
[ 035% ] audit: initializing netlink subsys (disabled)
[ 037% ] VFS: Disk quotas dquot_6.5.2
[ 038% ] FS-Cache: Netfs 'nfs' registered for caching
[ 039% ] Key type id_resolver registered
[ 040% ] msgmni has been set to 362
[ 041% ] io scheduler noop registered
[ 043% ] io scheduler cfq registered
[ 044% ] BCM2708FB: allocated DMA channel 0 @ f2007000
[ 045% ] bcm2708-dmaengine bcm2708-dmaengine: Load BCM2835 DMA engine driver
[ 046% ] vc-cma: Videocore CMA driver
[ 048% ] vc-cma: vc_cma_size      = 0x00000000 (0 MiB)
[ 049% ] brd: module loaded
[ 050% ] vchiq: vchiq_init_state: slot_zero = 0xcb800000, is_master = 0
[ 051% ] usbcore: registered new interface driver smsc95xx
[ 053% ] Core Release: 2.80a
[ 054% ] Finished setting default values for core params
[ 055% ] Periodic Transfer Interrupt Enhancement - disabled
[ 056% ] OTG VER PARAM: 0, OTG VER FLAG: 0
[ 058% ] WARN::dwc_otg_hcd_init:1047: FIQ DMA bounce buffers: virt = 0xcbc14000 dma = 0x4bc14000 len=9024
[ 059% ] Non-periodic Split Transactions
[ 060% ] High-Speed Isochronous Endpoints
[ 061% ] WARN::hcd_init_fiq:413: FIQ ASM at 0xc03fb064 length 36
[ 062% ] dwc_otg bcm2708_usb: DWC OTG Controller
[ 064% ] dwc_otg bcm2708_usb: irq 32, io mem 0x00000000
[ 065% ] Init: Power Port (0)
[ 066% ] usb usb1: New USB device strings: Mfr=3, Product=2, SerialNumber=1
[ 067% ] usb usb1: Manufacturer: Linux 3.18.10+ dwc_otg_hcd
[ 069% ] hub 1-0:1.0: USB hub found
[ 070% ] usbcore: registered new interface driver usb-storage
[ 071% ] bcm2835-cpufreq: min=700000 max=700000
[ 072% ] sdhci: Copyright(c) Pierre Ossman
[ 074% ] Load BCM2835 MMC driver
[ 075% ] ledtrig-cpu: registered to indicate activity on CPUs
[ 076% ] usbcore: registered new interface driver usbhid
[ 077% ] TCP: cubic registered
[ 079% ] NET: Registered protocol family 17
[ 080% ] registered taskstats version 1
[ 081% ] [vc_sm_connected_init]: start
[ 082% ] Waiting for root device /dev/mmcblk0p2...
[ 083% ] mmc0: host does not support reading read-only switch, assuming write-enable
[ 085% ] mmcblk0: mmc0:b368 SMI   15.0 GiB
[ 086% ] EXT4-fs (mmcblk0p2): INFO: recovery required on readonly filesystem
[ 087% ] EXT4-fs (mmcblk0p2): recovery complete
[ 088% ] usb 1-1: new high-speed USB device number 2 using dwc_otg
[ 090% ] Indeed it is in host mode hprt0 = 00001101
[ 091% ] Freeing unused kernel memory: 340K (c079b000 - c07f0000)
[ 092% ] usb 1-1: New USB device strings: Mfr=0, Product=0, SerialNumber=0
[ 093% ] hub 1-1:1.0: 3 ports detected
[ 095% ] usb 1-1.1: New USB device found, idVendor=0424, idProduct=ec00
[ 096% ] smsc95xx v1.0.4
[ 097% ] udevd[159]: starting version 175
[ 098% ] EXT4-fs (mmcblk0p2): re-mounted. Opts: (null)
[ 100% ] Driver for 1-wire Dallas network protocol.
`;

export default bootTxt;
