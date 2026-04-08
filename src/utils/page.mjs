export async function paging(query, limit, page, model) {
    if(limit) {
        limit = parseInt(limit);
        page = parseInt(page) || 1;

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            query.skip(skip).limit(limit).exec(),
            model.countDocuments(query.getQuery())
        ]);

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        };
    }
    else {
        const [data, total] = await Promise.all([
            query.exec(),
            model.countDocuments(query.getQuery())
        ]);

        return {
            data,
            total
        }
    }
}