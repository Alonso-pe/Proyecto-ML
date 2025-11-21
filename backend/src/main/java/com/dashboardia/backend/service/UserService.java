@Autowired
private MigoClient migoClient;

public MigoDniResponse verificarDatosPorDni(String dni) {
    return migoClient.consultarDni(dni);
}
