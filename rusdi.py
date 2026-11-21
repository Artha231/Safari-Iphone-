import math

def hitung_luas_lingkaran():
    print("\n--- Hitung Luas Lingkaran (Alas Tabung) ---")
    r = float(input("Masukkan jari-jari (r): "))
    
    if r < 0:
        print("Error: Jari-jari tidak boleh negatif!")
    else:
        
        luas = math.pi * (r ** 2)
        print(f"Luas Lingkaran = {luas:.2f}")


hitung_luas_lingkaran()