from astropy import units as u
from astropy.coordinates import SkyCoord, Distance, FK5
from astropy.time import Time
from astropy.units.si import ys
import numpy as np
from typing import cast, Any


def parse_ybsc_line(line: str):
    line = line.ljust(197)
    return [
        # HR - 0
        int(line[0:4].strip()),  # 1-4
        # Name - 1
        line[4:14].strip(),  # 5-14
        # DM - 2
        line[14:25].strip(),  # 15-25
        # HD - 3
        int(line[25:31].strip()) if line[25:31].strip() else None,  # 26-31
        # SAO - 4
        int(line[31:37].strip()) if line[31:37].strip() else None,  # 32-37
        # FK5 - 5
        int(line[37:41].strip()) if line[37:41].strip() else None,  # 38-41
        # IRflag - 6
        line[41:42].strip() or None,  # 42
        # r_IRflag - 7
        line[42:43].strip() or None,  # 43
        # Multiple - 8
        line[43:44].strip() or None,  # 44
        # ADS - 9
        line[44:49].strip(),  # 45-49
        # ADScomp - 10
        line[49:51].strip(),  # 50-51
        # VarID - 11
        line[51:60].strip(),  # 52-60
        # RAh1900 - 12
        int(line[60:62].strip()) if line[60:62].strip() else None,  # 61-62
        # RAm1900 - 13
        int(line[62:64].strip()) if line[62:64].strip() else None,  # 63-64
        # RAs1900 - 14
        float(line[64:68].strip()) if line[64:68].strip() else None,  # 65-68
        # DE1900_sign - 15
        line[68:69].strip() or None,  # 69
        # DEd1900 - 16
        int(line[69:71].strip()) if line[69:71].strip() else None,  # 70-71
        # DEm1900 - 17
        int(line[71:73].strip()) if line[71:73].strip() else None,  # 72-73
        # DEs1900 - 18
        int(line[73:75].strip()) if line[73:75].strip() else None,  # 74-75
        # RAh - 19
        int(line[75:77].strip()) if line[75:77].strip() else None,  # 76-77
        # RAm - 20
        int(line[77:79].strip()) if line[77:79].strip() else None,  # 78-79
        # RAs - 21
        float(line[79:83].strip()) if line[79:83].strip() else None,  # 80-83
        # DE_sign - 22
        line[83:84].strip() or None,  # 84
        # DEd - 23
        int(line[84:86].strip()) if line[84:86].strip() else None,  # 85-86
        # DEm - 24
        int(line[86:88].strip()) if line[86:88].strip() else None,  # 87-88
        # DEs - 25
        int(line[88:90].strip()) if line[88:90].strip() else None,  # 89-90
        # GLON - 26
        float(line[90:96].strip()) if line[90:96].strip() else None,  # 91-96
        # GLAT - 27
        float(line[96:102].strip()) if line[96:102].strip() else None,  # 97-102
        # Vmag - 28
        (float(line[102:107].strip()) if line[102:107].strip() else None),  # 103-107
        # n_Vmag - 29
        line[107:108].strip() or None,  # 108
        # u_Vmag - 30
        line[108:109].strip() or None,  # 109
        # B-V - 31
        (float(line[109:114].strip()) if line[109:114].strip() else None),  # 110-114
        # u_B-V - 32
        line[114:115].strip() or None,  # 115
        # U-B - 33
        (float(line[115:120].strip()) if line[115:120].strip() else None),  # 116-120
        # u_U-B - 34
        line[120:121].strip() or None,  # 121
        # R-I - 35
        (float(line[121:126].strip()) if line[121:126].strip() else None),  # 122-126
        # n_R-I - 36
        line[126:127].strip() or None,  # 127
        # SpType - 37
        line[127:147].strip(),  # 128-147
        # n_SpType - 38
        line[147:148].strip() or None,  # 148
        # pmRA - 39
        (float(line[148:154].strip()) if line[148:154].strip() else 0.0),  # 149-154
        # pmDE - 40
        (float(line[154:160].strip()) if line[154:160].strip() else 0.0),  # 155-160
        # n_Parallax - 41
        line[160:161].strip() or None,  # 161
        # Parallax - 42
        (
            np.clip(float(line[161:166].strip()), 0.001, None)
            if line[161:166].strip()
            else 0.001
        ),  # 162-166
        # RadVel - 43
        (int(line[166:170].strip()) if line[166:170].strip() else 0.0),  # 167-170
        # n_RadVel - 44
        line[170:174].strip() or None,  # 171-174
        # l_RotVel - 45
        line[174:176].strip() or None,  # 175-176
        # RotVel - 46
        (int(line[176:179].strip()) if line[176:179].strip() else None),  # 177-179
        # u_RotVel - 47
        line[179:180].strip() or None,  # 180
        # Dmag - 48
        (float(line[180:184].strip()) if line[180:184].strip() else None),  # 181-184
        # Sep - 49
        (float(line[184:190].strip()) if line[184:190].strip() else None),  # 185-190
        # MultID - 50
        line[190:194].strip(),  # 191-194
        # MultCnt - 51
        (int(line[194:196].strip()) if line[194:196].strip() else None),  # 195-196
        # NoteFlag - 52
        line[196:197].strip() or None,  # 197
    ]


def spec_type_to_bv(spec_types):
    s = np.char.upper(spec_types.astype(str))
    conds = [
        np.char.startswith(s, "O"),
        np.char.startswith(s, "B"),
        np.char.startswith(s, "A"),
        np.char.startswith(s, "F"),
        np.char.startswith(s, "G"),
        np.char.startswith(s, "K"),
        np.char.startswith(s, "M"),
    ]

    choices = [-0.32, -0.18, 0.0, 0.42, 0.63, 0.91, 1.4]

    return np.select(conds, choices, default=0.65)


if __name__ == "__main__":
    print("Parsing YBSC data...")

    stars_data = []
    with open("./data/ybsc5.txt", "r") as f:
        for line in f:
            if line.strip():
                data = parse_ybsc_line(line)
                if data[19] is not None and data[22] is not None:
                    stars_data.append(data)

    stars_data = np.array(stars_data).T

    # get RA and Dec in degrees
    ras = stars_data[19] + stars_data[20] / 60 + stars_data[21] / 3600
    decs = np.where(
        stars_data[22] == "+",
        stars_data[23] + stars_data[24] / 60 + stars_data[25] / 3600,
        -(stars_data[23] + stars_data[24] / 60 + stars_data[25] / 3600),
    )

    # convert proper motion to mas/yr
    pmra_mas = (stars_data[39] * u.arcsec / u.yr).to(u.mas / u.yr)
    pmdec_mas = (stars_data[40] * u.arcsec / u.yr).to(u.mas / u.yr)

    # parallax in arcseconds
    parallax = stars_data[42] * u.arcsecond

    # radial velocity in km/s
    radvel_kms = stars_data[43] * u.km / u.s

    # create SkyCoord object
    coords = (
        SkyCoord(
            ra=ras * u.hourangle,
            dec=decs * u.deg,
            pm_ra_cosdec=pmra_mas,
            pm_dec=pmdec_mas,
            radial_velocity=radvel_kms,
            frame=FK5(equinox=Time("J2000.0")),
            obstime=Time("J2000.0"),
            distance=Distance(parallax=parallax, allow_negative=True),
        )
        .apply_space_motion(new_obstime=Time.now())
        .transform_to(FK5(equinox=Time.now()))
    )

    # Actually use the SkyCoords to get cartesian coordinates
    ra_rad = cast(np.ndarray, cast(Any, coords.ra).rad)
    dec_rad = cast(np.ndarray, cast(Any, coords.dec).rad)

    phi = -ra_rad
    theta = dec_rad

    xs = np.round(np.cos(theta) * np.cos(phi), decimals=4)
    ys = np.round(np.sin(theta), decimals=4)
    zs = np.round(np.cos(theta) * np.sin(phi), decimals=4)

    # Get current RA and Dec in hms/dms format
    ra_hms = getattr(coords, "ra").hms
    dec_dms = getattr(coords, "dec").signed_dms

    DMs = np.where(stars_data[3] != None, stars_data[3], "")
    SAOs = np.where(stars_data[4] != None, stars_data[4], "")
    bvs = np.where(
        stars_data[31] != None, stars_data[31], spec_type_to_bv(stars_data[37])
    )

    mags = np.where(stars_data[28] != None, stars_data[28], 6.0)

    data = np.array(
        [
            stars_data[0],
            stars_data[1],
            DMs,
            SAOs,
            bvs,
            mags,
            xs,
            ys,
            zs,
            np.round(ra_hms.h).astype(int),  # RAh
            np.round(ra_hms.m).astype(int),  # RAm
            np.round(ra_hms.s, decimals=4),  # RAs
            np.where(dec_dms.sign < 0, "-", "+"),  # DEsn
            np.round(dec_dms.d).astype(int),  # DEd
            np.round(dec_dms.m).astype(int),  # DEm
            np.round(dec_dms.s, decimals=4),  # DEs
            stars_data[37],
            stars_data[39],
            stars_data[40],
        ]
    ).T

    with open("./data/ybsc_parsed.csv", "w") as f:
        f.write(
            "HR,Name,DM,SAO,B-V,Vmag,x,y,z,RAh,RAm,RAs,DEsn,DEd,DEm,DEs,SpType,pmRA,pmDE\n"
        )
        for row in data:
            f.write(",".join(map(str, row)) + "\n")
