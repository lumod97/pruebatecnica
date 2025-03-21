import Swal from "sweetalert2";

export default class SwalUtils {
  static info(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: "info",
      confirmButtonText: "Aceptar",
    });
  }

  static success(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  }

  static error(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }

  static warning(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: "warning",
      confirmButtonText: "Aceptar",
    });
  }

  static question(title: string, text: string): Promise<any> {
    return Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    });
  }
}