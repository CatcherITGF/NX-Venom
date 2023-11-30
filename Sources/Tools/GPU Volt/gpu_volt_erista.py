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

cvb_coeff = [814294, 856185, 898077, 939968, 981860, 1023751, 1065642, 1107534, 1149425, 1191317, 1233208, 1275100, 1316991]

gpu_freq_table = [76800, 153600, 230400, 307200, 384000, 460800, 537600, 614400, 691200, 768000, 844800, 921600, 998400]

temp_list = [20, 30, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]

def round_closest(value, scale):
    if (value > 0):
        return (((value) + ((scale) / 2)) / (scale))
    else:
        return (((value) - ((scale) / 2)) / (scale))

def round5(number):
    return int(math.ceil(number / 5.0)) * 5

speedo = int(input("Enter gpu speedo: ")) 
  
offset = int(input("Enter gpu offset: ")) 
for i in range(13):
    cvb_coeff[i] -= offset*1000
    
print("\t\t", end="")

for temp in temp_list:
    print(temp, "°C\t", end="")
print()

for entry in range(13):
    print(float(gpu_freq_table[entry]/1000),end="")
    print("\t\t", end="")

    mv = round_closest(-940 * speedo , 100)
    mv = round_closest( (mv + 8144) * speedo , 100) + cvb_coeff[entry]
    #mv = round5(mv/1000)
    
    for temp in temp_list:
        mvt = round_closest(808 * speedo , 100) + -21583 + round_closest(226 * temp , 10)
        mvt = round_closest(mvt * temp , 10)
        #mvt = round5(mvt/1000)
        final_volt = math.ceil ((mv + mvt) / 1000)
        vmin = 812
        final_volt = max(final_volt, vmin)
        #final_volt = round5(final_volt)
        print(final_volt, "\t", end="")
    print()

#input("Press enter to exit")

