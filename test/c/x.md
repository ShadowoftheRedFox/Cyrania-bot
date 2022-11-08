**__Les tableaux en C:__**

Les tableaux (plus communément appelés Array), sont des suites de valeurs.
En C, comme toutes autres variables, ils sont (malheureusement) typés. **De plus**, ils ne peuvent être modifié qu'en surface, c'est à dire qu'une fois votre tableau déclaré, vous ne pouvez ni changer son type, ni sa taille. 
**PS:** un string (une chaîne) est un tableau de charactère. Si vous demandez une chaine avec scanf, il faut faire:
```c
char Chaine[100]; // 100 charactères maximum vont être rentrés. Il suffit de changer le 100 en une autre valeur pour changer le nombre max.

// %s réfère à une chaine de charactères
scanf("%s", Chaine); 
/*
remarquez qu'on met directement Chaine, et non &Chaine
La raison qu'un tableau est (grossièrement) un tableau de valeur pointant vers la case en mémoire de chaque object du tableau.
Le tableau est "un pointeur en lui même"
(Il y a des exceptions, sinon ça ne serait pas marrant)
```

Exemples:
```c
#include <stdio.h>

int main() {
    // les notes d'un bon élève
    unsigned int Notes[12] = {15, 18, 19, 16, 17, 18, 18, 20};

    // notez que l'on peut mettre jusq'à 12 notes, mais que seulement 8 sont présentes

    // imaginons que le prof rajoute une 9ème note:
    Notes[8] = 11; // un raté de l'élève surement

    // attendez, 8 ? alors que c'est la 9ème note?
    // oui! on note l'emplacement de la case d'un tableau un "index"
    // la première case d'un tableau à pour index 0, la deuxième 1, et ainsi de suite
    // un tableau de 12 case, à des index allant de 0 à 11!
    // si vous voulez modifier la 9ème case, il faut aller à l'index 8

    // notez aussi que l'on utilise encore Notes[Nombre], non pour déclarer à nouveau, mais pour indique que l'on veut accéder à la case d'index Nombre

    // calculons la moyenne alors
    // avec une boucle for (révisions ^^)
    int moyenne = 0;
    for (int index = 0; index < 12; index++) {
        // l'index augmente de 0 à 11 avec un pas de 1
        // il vas donc accéder à la valeu de toutes les cases de Notes, et les ajouter à moyenne
        moyenne += Notes[index];
    }

    printf("La moyenne de cet eleve est de %f", (float)(moyenne / 12));
    // note: (type)(expressions), est pour indiquer que le résultat de cet expréssions est voulue avec le type précisé.
    // ici, on divise un int par un int, le résultat par défaut est donc un int, sauf qu'un moyenne peut avoir des virgules, donc un float!

    return 0;
}
```