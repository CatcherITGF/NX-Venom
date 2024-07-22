# Copyright  2023 hanai3Bi
#
# This program is free software; you can redistribute it and/or modify it
# under the terms and conditions of the GNU General Public License,
# version 2, as published by the Free Software Foundation.
#
# This program is distributed in the hope it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
# FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
# more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import math



gpu_dvfs_table_0 = [
    [ 500000, 0 , 0 , 0 , 0 , 0 ], 
    [ 500000, 0 , 0 , 0 , 0 , 0 ],
    [ 500000, 0 , 0 , 0 , 0 , 0 ],
    [ 500000, 0 , 0 , 0 , 0 , 0 ],
    [ 500000, 0 , 0 , 0 , 0 , 0 ],    
    [ 500000, 0 , 0 , 0 , 0 , 0 ],    
    [ 500000, 0 , 0 , 0 , 0 , 0 ],    
    [ 500000, 0 , 0 , 0 , 0 , 0 ],    
    [ 838712,  -7304, -552,  119,  -3750,   -2 ],
    [ 880210,  -7955, -584,    0,  -2849,   39 ],    
    [ 926398,  -8892, -602,  -60,   -384,  -93 ],    
    [ 970060, -10108, -614, -179,   1508,  -13 ],    
    [ 1065665, -16075, -497, -179,   3213,    9 ],    
    [ 1132576, -16093, -648,    0,   1077,   40 ],    
    [ 1180029, -14534, -830,    0,   1469,  110 ], 
    [ 1248293, -16383, -859,    0,   3722,  313 ],
    [ 1286399, -17475, -867,    0,   3681,  559 ],         
    [ 1306399, -17475, -867,    0,   3681,  559 ]   
]




gpu_dvfs_table_1 = [
    [ 500000, 0 , 0 , 0 , 0 , 0 ], 
    [ 500000, 0 , 0 , 0 , 0 , 0 ],
    [ 500000, 0 , 0 , 0 , 0 , 0 ],
    [ 500000, 0 , 0 , 0 , 0 , 0 ],
    [ 500000, 0 , 0 , 0 , 0 , 0 ],    
    [ 500000, 0 , 0 , 0 , 0 , 0 ],    
    [ 500000, 0 , 0 , 0 , 0 , 0 ],    
    [ 500000, 0 , 0 , 0 , 0 , 0 ],    
    [ 838712,  -7304, -552,  119,  -3750,   -2 ],
    [ 880210,  -7955, -584,    0,  -2849,   39 ],    
    [ 926398,  -8892, -602,  -60,   -384,  -93 ],    
    [ 970060, -10108, -614, -179,   1508,  -13 ],    
    [ 1065665, -16075, -497, -179,   3213,    9 ],    
    [ 1132576, -16093, -648,    0,   1077,   40 ],    
    [ 1180029, -14534, -830,    0,   1469,  110 ], 
    [ 1218293, -16383, -859,    0,   3722,  313 ],
    [ 1246399, -17475, -867,    0,   3681,  559 ],         
    [ 1266399, -17475, -867,    0,   3681,  559 ] 
]


gpu_dvfs_table_2 = [
    [ 500000, 0 , 0 , 0 , 0 , 0 ], #76800
    [ 500000, 0 , 0 , 0 , 0 , 0 ], #153600
    [ 500000, 0 , 0 , 0 , 0 , 0 ], #230400
    [ 500000, 0 , 0 , 0 , 0 , 0 ], #307200
    [ 500000, 0 , 0 , 0 , 0 , 0 ], #384000 
    [ 500000, 0 , 0 , 0 , 0 , 0 ], #460800 
    [ 500000, 0 , 0 , 0 , 0 , 0 ], #537600
	[ 500000, 0 , 0 , 0 , 0 , 0 ], #614400
    [ 838712,  -7304, -552,  119,  -3750,   -2 ],  #691200
    [ 880210,  -7955, -584,    0,  -2849,   39 ],  #768000
    [ 926398,  -8892, -602,  -60,   -384,  -93 ], #844800
    [ 970060, -10108, -614, -179,   1508,  -13 ], 	#921600
    [ 1060665, -16075, -497, -179,   3213,    9 ],   #998400
    [ 1117576, -16093, -648,    0,   1077,   40 ], #1075200
    [ 1094475, -12688, -648,    0,   1077,   40 ],  #1152000
    [ 1124475, -12688, -648,    0,   1077,   40 ], #1228800
    [ 1142060, -12688, -648,    0,   1077,   40 ], #1267200
    [ 1163644, -12688, -648,    0,   1077,   40 ] #1305600
]


gpu_freq_table = [76800, 153600, 230400, 307200, 384000, 460800, 537600, 614400, 691200, 768000, 844800, 921600, 998400, 1075200, 1152000, 1228800, 1267200, 1305600]

temp_list = [-25, 20, 30, 50, 70, 90]

def div_round_closest(value, scale):
    if (value > 0):
        return (((value) + ((scale) / 2)) / (scale))
    else:
        return (((value) - ((scale) / 2)) / (scale))

def round5(number):
    return math.ceil(number / 5000) * 5000
    
def tegra_get_cvb_voltage(speedo: int, s_scale: int, cvb: list[int]):
    mv = div_round_closest(cvb[2] * speedo, s_scale)
    mv = div_round_closest((mv + cvb[1]) * speedo, s_scale) + cvb[0]
    return mv
    
def tegra_get_cvb_t_voltage(speedo: int, s_scale: int, t_scale: int, t: int, cvb: list[int]):
    mv = div_round_closest(cvb[3] * speedo, s_scale) + cvb[4] + div_round_closest(cvb[5] * t, t_scale)
    mv = div_round_closest(mv * t, t_scale)
    return mv
    
def tegra_round_cvb_voltage(mv: int, v_scale: int):
    return 0

speedo = int(input("Enter gpu speedo: ")) 

table = int(input("Enter gpu table (0~2): "))
if (table == 0):
    gpu_dvfs_table = gpu_dvfs_table_0
elif (table == 1):
    gpu_dvfs_table = gpu_dvfs_table_1
else:
    gpu_dvfs_table = gpu_dvfs_table_2
    
offset = int(input("Enter gpu offset: ")) 

vmin = int(input("Enter gpu vmin: ")) 

for i in range(18):
    gpu_dvfs_table[i][0] -= offset*1000
    
print("\t\t", end="")

for entry in range(18):
    print(int(gpu_freq_table[entry]/1000), "\t", end="")
print()
    

thermal_floor = [ [ 0 for i in range(18) ] for j in range(7) ]

#build thermal floor
for entry in range(18):
    mv = div_round_closest(gpu_dvfs_table[entry][2] * speedo , 100)
    mv = div_round_closest( (mv + gpu_dvfs_table[entry][1]) * speedo , 100) + gpu_dvfs_table[entry][0]
    
    for temp in range(6):
        mvt = div_round_closest(gpu_dvfs_table[entry][3] * speedo , 100) + gpu_dvfs_table[entry][4] + div_round_closest(gpu_dvfs_table[entry][5] * temp_list[temp] , 10)
        mvt = div_round_closest(mvt * temp_list[temp] , 10)
        
        final_volt = mv + mvt
        final_volt = round5(final_volt)
        final_volt /= 1000
        
        thermal_floor[temp][entry] = int(final_volt)

for i in range(18):
    thermal_floor[0][i] = 800     
     
 
for temp in range(6):
    if temp == 0:
        print(">", temp_list[temp], "°C\t", end="")
    else:
        print(">", temp_list[temp], "°C\t\t", end="")
    
    for entry in range(18):
        mv = max(thermal_floor[temp][entry], thermal_floor[temp+1][entry])
        #vmin = 610 if table == 0 else 610
        final_volt = max(mv, vmin)
        print(final_volt, "\t", end="")
    print()
        
       
       
input("Press enter to exit")

