const queryString =
    "SELECT" +
    '"StateBusinesses"."Id",' +
    '"StateBusinesses"."County",' +
    '"StateBusinesses"."Name", ' +
    '"StateBusinesses"."Address",' +
    '"StateBusinesses"."City",' +
    '"StateBusinesses"."PostalCode",' +
    '"StateBusinesses"."AltPhone",' +
    '"StateBusinesses"."Website",' +
    '"StateBusinesses"."Sales",' +
    '"StateBusinesses"."Employees",' +
    '"StateBusinesses"."SicCode",' +
    '"StateBusinesses"."Industry",' +
    '"StateBusinesses"."EmailDomain",' +
    "json_agg(" +
    "json_build_object(" +
    '\'Id\', "Contacts"."Id",' +
    '\'Name\', "Contacts"."Name",' +
    '\'Title\', "Contacts"."Title",' +
    '\'Phone\', "Contacts"."Phone",' +
    '\'Email\', "Contacts"."Email" ' +
    ")" +
    ")" +
    'as "Contacts"' +
    'FROM public."StateBusinesses" Inner Join "Contacts" On public."StateBusinesses"."Id" = "Contacts"."StateBusinessId"' +
    'Where "StateBusinesses"."Name" Like $1 Group By "StateBusinesses"."Id"';