import pandas as pd
import matplotlib.pyplot as plt
from numpy import sqrt as racine
fichier = "iris.csv"
iris = pd.read_csv(fichier)

x = iris.loc[:, "petal_length"]
y = iris.loc[:, "petal_width"]
lab = iris.loc[:, "species"]
x_new=int(input("entrer la longueur des pétales de la nouvelle iris: "))
y_new=float(input("entrer la largeur des pétales de la nouvelle iris: "))
plt.scatter(x[lab == 0], y[lab == 0], color='green', label='setosa')
plt.scatter(x[lab == 1], y[lab == 1], color='yellow', label='virginica')
plt.scatter(x[lab == 2], y[lab == 2], color='red', label='versicolor')
plt.scatter(x_new, y_new, color='black', label='unknown')


plt.xlabel('longueur des pétales')
plt.ylabel('largeur des pétales')

plt.legend()


fichier = "iris.csv"



def distance(x1, y1, x2, y2):

    return racine((x1-x2)**2 + (y1-y2)**2)

def k_plus_proches_voisins(fichier, x_new, y_new, k):

    iris = pd.read_csv(fichier)
    iris['dist'] = distance(iris['petal_length'], iris['petal_width'], x_new, y_new )
    iris = iris.sort_values(by = 'dist')
    s = iris.head(k)['species'].value_counts().rename({0: 'setosa', 1: 'virginica', 2: 'versicolor'})
    return s.idxmax()
k=int(input('entrer la valeur de K :'))
print(k_plus_proches_voisins(fichier, x_new, y_new, k))