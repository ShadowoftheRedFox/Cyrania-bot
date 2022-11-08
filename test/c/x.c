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

#include <stdio.h>

int moyenne() {
    int TabLength;
    printf("Entrez le nombre de notes: ");
    scanf_s("%d", &TabLength);

    if (TabLength == 0) {
        printf("Vous devez rentrer au moins une note!\n");
        return 1;
    } else if (TabLength > 100) {
        printf("Trop de valeu à rentrer!\n");
        return 1;
    }

    int Notes[TabLength];
    int index = 0;

    unsigned int note;
    do {
        printf("Rentrez une note: ");
        scanf_s("%d", &note);
        if (note <= 20) {
            Notes[index] = note;
            index++;
        }
    } while (index < TabLength);

    int pireNote = 20;
    for (int i = 0; i < TabLength; i++) {
        if (pireNote > Notes[i]) {
            pireNote = Notes[i];
        }
    }

    int removed = 0;
    long long moyenne = 0;
    for (int i = 0; i < TabLength; i++) {
        if (pireNote == Notes[i] && !removed) {
            removed = 1;
        } else {
            moyenne += Notes[i];
        }
    }

    printf("La moyenne des notes est de %f", (float)(moyenne / (TabLength - 1)));
    return 0;
}