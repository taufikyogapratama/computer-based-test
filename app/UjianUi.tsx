"use client";
import { useRef } from "react";

type props = {
  user: boolean;
  changeUser: (newUser: boolean) => void;
};

const UjianUi = (props: props) => {
  const nama = useRef(null);
  const nim = useRef(null);
  const kelas = useRef(null);
  const kode = useRef(null);
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <main>
        <form>
          <label htmlFor="nama">Nama:</label>
          <br />
          <input
            type="teks"
            ref={nama}
            id="nama"
            name="nama"
            required
            className="border rounded px-1"
          />
          <br />
          <label htmlFor="nim">NIM:</label>
          <br />
          <input
            type="number"
            id="nim"
            ref={nim}
            name="nim"
            required
            className="border rounded px-1"
          />
          <br />
          <label htmlFor="kelas">Kelas:</label>
          <select name="kelas" id="kelas" ref={kelas}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          <br />
          <label htmlFor="kode">Kode:</label>
          <br />
          <input
            type="teks"
            id="kode"
            ref={kode}
            name="kode"
            required
            className="border rounded px-1"
          />
          <br />
          <button type="submit">Mulai</button>
        </form>
        <button onClick={() => props.changeUser(!props.user)}>
          Login Sebagai Guru
        </button>
      </main>
    </div>
  );
};

export default UjianUi;
