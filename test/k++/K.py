from math import*
import matplotlib.pyplot as plt
import csv

def distance (a, b, c, d):
    d = sqrt(pow((a-c), 2)+ pow((b-d), 2))
    return d

liris = []
with open ("iris.csv", mode = "r") as csvfile:
    spamreader = csv.reader(csvfile, delimiter = ",")
    i = 0
    for row in spamreader:
        if i==0:
            i+=1
        else:
            liris.append(list(row))
print(liris)


xseto = []
yseto = []
xversi = []
yversi = []
xvirgi = []
yvirgi = []

for i in range (len(liris)):
    if liris[i][2]=="0":
        xseto.append(float(liris[i][0]))
        yseto.append(float(liris[i][1]))
    elif liris[i][2]=="1":
        xversi.append(float(liris[i][0]))
        yversi.append(float(liris[i][1]))
    else:
        xvirgi.append(float(liris[i][0]))
        yvirgi.append(float(liris[i][1]))

Inconnu = [2.3, 2 ]

plt.scatter(Inconnu[0], Inconnu[1], color='yellow', label="l'inconnue")
plt.scatter(xseto, yseto, color='blue', label='setosa')
plt.scatter(xversi, yversi, color='green', label='versicolor')
plt.scatter(xvirgi, yvirgi, color='violet', label='virginica')


for h in liris:
    h.append(distance(Inconnu[0], Inconnu[1], float(h[0]), float(h[1])))


liris.sort(key=lambda p:p[3])
print(liris)
k=int(input("donner la valeur de k"))
nseto,nvirgi,nversi=0,0,0
for i in range(k):
    if liris[i][2]=='0':
        nseto+=1
    elif liris[i][2]=='1':
        nversi+=1
    else:
        nvirgi+=1
if nseto>nversi and nseto>nvirgi :
    print("les proprietés de la nouvelle iris correspondent a une iris setosa")
    Inconnu.append('0')
elif nseto>nversi and nseto<nvirgi :
    print("Les proprietes de la nouvelle iris correspondent a une iris virginica")
    Inconnu.append('2')
else:
    print("Les proprietés de la nouvelle iris correspondent a une iris versicolor")


