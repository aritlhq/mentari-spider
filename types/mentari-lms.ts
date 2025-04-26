export interface Course {
    id: string;
    kode_course: string;
    coursename: string;
    shortname: string;
    id_mata_kuliah: string;
    id_prodi: string;
    id_semester_registrasi: string;
    id_periode: string;
    id_kelas: string;
    id_shift: string;
    id_hari_waktu_kuliah: string;
    nama_hari: string;
    nama_mata_kuliah: string;
    sks: number;
    createdAt: string;
    nama_dosen: string;
}

export interface CourseDetails {
    kode_course: string;
    coursename: string;
    haveAction: boolean;
    content_type: string;
    peserta: Array<{
        nim: string;
        nama_mahasiswa: string;
        alamat_email: string;
        no_hp_mahasiswa: string;
    }>;
    data: Array<{
        kode_section: string;
        sort: number;
        nama_section: string;
        sub_section: Array<{
            id: string;
            tipe: string;
            kode_template: string;
            sort: number;
            judul: string;
            konten: string;
            link: string | null;
            file: any;
            setting_availability: any;
            completion: boolean;
            haveAction: boolean;
            createdAt: string;
            warningAlert?: string;
            setting_quiz?: {
                tipe_quiz: string;
                one_page_per_question: boolean;
                duration: number;
            };
        }>;
        createdAt: any;
    }>;
}